"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fill } from "@/lib/i18n/config";
import { useLocale, useLocalePath } from "@/lib/i18n/client";
import {
  ERROR_CODES,
  MAX_CLIP_BYTES,
  THUMB_TARGET_BYTES,
  THUMB_WIDTH,
  TITLE_MAX,
  TITLE_MIN,
  VIDEO_ACCEPT,
  normaliseTitle,
  resolveVideoMime,
  type ClipErrorCode,
  type VideoMime,
} from "@/lib/clips/constants";
import { formatBytes, formatDuration } from "@/lib/clips/format";

/* ═══════════════════════════════════════════════════════════════════════════
 *  UPLOAD FORM
 *  1. Validate type and size before a single byte is sent.
 *  2. Cut a ~640px poster frame from ~1s in, via <video> + <canvas>, and read
 *     the duration. Formats the browser can't decode simply post without one.
 *  3. Open the upload, send the poster, then the video in 8 MiB parts over
 *     XHR (for upload progress), then complete. See app/api/clips/upload.
 * ═══════════════════════════════════════════════════════════════════════════ */

type Labels = {
  titleLabel: string;
  titleHint: string;
  titlePlaceholder: string;
  gameLabel: string;
  gamePlaceholder: string;
  fileLabel: string;
  fileHint: string;
  choose: string;
  change: string;
  posterLabel: string;
  posterPending: string;
  posterFailed: string;
  fileInfo: string;
  submit: string;
  uploading: string;
  finishing: string;
  cancel: string;
  guidelines: string;
};

interface UploadFormProps {
  games: { key: string; name: string }[];
  labels: Labels;
  errors: Record<ClipErrorCode, string>;
}

type Picked = { file: File; mime: VideoMime };
type Poster = { status: "pending" } | { status: "ready"; blob: Blob; url: string } | { status: "failed" };

const isCode = (v: unknown): v is ClipErrorCode => typeof v === "string" && (ERROR_CODES as readonly string[]).includes(v);

class UploadError extends Error {
  constructor(public code: ClipErrorCode) {
    super(code);
  }
}

/* ── Poster frame ─────────────────────────────────────────────────────── */

function once(target: EventTarget, ok: string, ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => done(new Error("timeout")), ms);
    const onOk = () => done();
    const onErr = () => done(new Error("media-error"));
    function done(err?: Error) {
      clearTimeout(timer);
      target.removeEventListener(ok, onOk);
      target.removeEventListener("error", onErr);
      if (err) reject(err);
      else resolve();
    }
    target.addEventListener(ok, onOk);
    target.addEventListener("error", onErr);
  });
}

const toBlob = (canvas: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q));

async function makePoster(file: File): Promise<{ blob: Blob | null; duration: number | null }> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;
  let duration: number | null = null;
  try {
    await once(video, "loadedmetadata", 15000);
    duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null;
    if (!video.videoWidth || !video.videoHeight) return { blob: null, duration };

    video.currentTime = Math.min(1, (duration ?? 2) / 2);
    await once(video, "seeked", 15000);

    const width = Math.min(THUMB_WIDTH, video.videoWidth);
    const height = Math.round((width * video.videoHeight) / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { blob: null, duration };
    ctx.drawImage(video, 0, 0, width, height);

    // WebP where the browser can encode it (Safari can't and returns PNG).
    let type = "image/webp";
    let blob = await toBlob(canvas, type, 0.75);
    if (!blob || blob.type !== type) {
      type = "image/jpeg";
      blob = await toBlob(canvas, type, 0.8);
    }
    for (let q = 0.65; blob && blob.size > THUMB_TARGET_BYTES && q >= 0.35; q -= 0.15) {
      blob = await toBlob(canvas, type, q);
    }
    return { blob: blob && blob.size <= THUMB_TARGET_BYTES * 1.5 ? blob : null, duration };
  } catch {
    return { blob: null, duration };
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

/* ── Transport ────────────────────────────────────────────────────────── */

function send(
  method: string,
  url: string,
  body: XMLHttpRequestBodyInit | null,
  opts: { contentType?: string; onProgress?: (loaded: number) => void; register?: (xhr: XMLHttpRequest) => void } = {},
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    opts.register?.(xhr);
    xhr.open(method, url);
    if (opts.contentType) xhr.setRequestHeader("Content-Type", opts.contentType);
    xhr.responseType = "json";
    if (opts.onProgress) xhr.upload.onprogress = (e) => opts.onProgress!(e.loaded);
    xhr.onload = () => {
      const res = (xhr.response ?? {}) as Record<string, unknown>;
      if (xhr.status >= 200 && xhr.status < 300 && res.ok) resolve(res);
      else reject(new UploadError(isCode(res.error) ? res.error : xhr.status === 413 ? "too-large" : "server"));
    };
    xhr.onerror = () => reject(new UploadError("network"));
    xhr.onabort = () => reject(new DOMException("aborted", "AbortError"));
    xhr.send(body);
  });
}

/* ── Component ────────────────────────────────────────────────────────── */

const field = "clip-notch-sm w-full border border-steel-line bg-void px-3 py-2.5 text-bone placeholder:text-bone-faint/70 focus:border-crimson";
const labelCls = "font-display text-xs tracking-[0.14em] text-bone-faint uppercase";

export function UploadForm({ games, labels, errors }: UploadFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const toLocale = useLocalePath();

  const [picked, setPicked] = useState<Picked | null>(null);
  const [poster, setPoster] = useState<Poster | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "uploading" | "finishing" | "done">("idle");
  const [progress, setProgress] = useState(0);

  const busy = phase !== "idle";
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const uploadIdRef = useRef<string | null>(null);
  const cancelled = useRef(false);
  const pickToken = useRef(0);
  const posterUrl = poster?.status === "ready" ? poster.url : null;

  useEffect(() => () => {
    if (posterUrl) URL.revokeObjectURL(posterUrl);
  }, [posterUrl]);

  async function onFile(file: File | undefined) {
    const token = ++pickToken.current;
    setFileError(null);
    setError(null);
    setPicked(null);
    setPoster(null);
    setDuration(null);
    if (!file) return;

    const mime = resolveVideoMime(file.type, file.name);
    if (!mime) return setFileError(errors["invalid-type"]);
    if (file.size > MAX_CLIP_BYTES) return setFileError(errors["too-large"]);
    if (file.size === 0) return setFileError(errors["invalid-upload"]);

    setPicked({ file, mime });
    setPoster({ status: "pending" });
    const { blob, duration } = await makePoster(file);
    if (token !== pickToken.current) return; // another file was picked meanwhile
    setDuration(duration);
    setPoster(blob ? { status: "ready", blob, url: URL.createObjectURL(blob) } : { status: "failed" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !picked) return;
    const data = new FormData(e.currentTarget);
    const title = normaliseTitle(data.get("title"));
    const game = String(data.get("game") ?? "");
    if (!title) return setError(errors["invalid-title"]);
    if (!games.some((g) => g.key === game)) return setError(errors["invalid-game"]);

    setError(null);
    setPhase("uploading");
    setProgress(0);
    cancelled.current = false;
    const register = (x: XMLHttpRequest) => (xhrRef.current = x);

    try {
      const { file, mime } = picked;
      const init = await send(
        "POST",
        "/api/clips/upload",
        JSON.stringify({ title, game, mime, fileName: file.name, size: file.size, durationS: duration }),
        { contentType: "application/json", register },
      );
      const id = String(init.id);
      const partSize = Number(init.partSize);
      const total = Number(init.parts);
      uploadIdRef.current = id;
      const base = `/api/clips/upload/${id}`;

      if (poster?.status === "ready") {
        // A failed poster is not worth failing the clip over.
        await send("PUT", `${base}/thumb`, poster.blob, { contentType: poster.blob.type, register }).catch((err) => {
          if (err instanceof DOMException) throw err;
        });
      }

      const parts: { partNumber: number; etag: string }[] = [];
      for (let n = 1; n <= total; n++) {
        const start = (n - 1) * partSize;
        const chunk = file.slice(start, Math.min(start + partSize, file.size));
        const res = await send("PUT", `${base}/part/${n}`, chunk, {
          contentType: "application/octet-stream",
          register,
          onProgress: (loaded) => setProgress(Math.min(99, Math.floor(((start + loaded) / file.size) * 100))),
        });
        parts.push({ partNumber: Number(res.partNumber), etag: String(res.etag) });
      }

      setPhase("finishing");
      setProgress(100);
      await send("POST", `${base}/complete`, JSON.stringify({ parts }), { contentType: "application/json", register });
      uploadIdRef.current = null;
      setPhase("done");
      router.push(toLocale(`/clips/${id}`));
    } catch (err) {
      const id = uploadIdRef.current;
      uploadIdRef.current = null;
      if (id) void fetch(`/api/clips/upload/${id}`, { method: "DELETE" }).catch(() => {});
      setPhase("idle");
      setProgress(0);
      if (!cancelled.current) setError(errors[err instanceof UploadError ? err.code : "network"]);
    }
  }

  function cancel() {
    cancelled.current = true;
    xhrRef.current?.abort();
  }

  const fileInfo = picked
    ? fill(labels.fileInfo, {
        size: formatBytes(picked.file.size, locale),
        duration: duration ? formatDuration(duration) : "–",
      })
    : null;

  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid gap-6" aria-busy={busy}>
      <label className="grid gap-2">
        <span className={labelCls}>{labels.titleLabel}</span>
        <input
          name="title"
          required
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          placeholder={labels.titlePlaceholder}
          disabled={busy}
          className={field}
          aria-describedby="clip-title-hint"
        />
        <span id="clip-title-hint" className="text-xs text-bone-faint">
          {fill(labels.titleHint, { min: TITLE_MIN, max: TITLE_MAX })}
        </span>
      </label>

      <label className="grid gap-2">
        <span className={labelCls}>{labels.gameLabel}</span>
        <select name="game" required defaultValue="" disabled={busy} className={field}>
          <option value="" disabled>
            {labels.gamePlaceholder}
          </option>
          {games.map((g) => (
            <option key={g.key} value={g.key}>
              {g.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2">
        <span className={labelCls} id="clip-file-label">
          {labels.fileLabel}
        </span>
        <label className="clip-notch flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-steel-hi bg-void/50 px-4 py-8 text-center transition-colors hover:border-crimson/60 has-focus-visible:border-crimson has-disabled:cursor-not-allowed">
          <input
            type="file"
            accept={VIDEO_ACCEPT}
            disabled={busy}
            aria-labelledby="clip-file-label"
            aria-describedby="clip-file-hint clip-file-error"
            className="sr-only"
            onChange={(e) => void onFile(e.currentTarget.files?.[0])}
          />
          <span className="font-display text-sm tracking-[0.14em] text-bone uppercase">{picked ? labels.change : labels.choose}</span>
          {picked ? (
            <span className="max-w-full truncate text-sm text-bone-dim" dir="auto">
              {picked.file.name}
            </span>
          ) : null}
          <span id="clip-file-hint" className="text-xs text-bone-faint">
            {fileInfo ?? fill(labels.fileHint, { max: formatBytes(MAX_CLIP_BYTES, locale) })}
          </span>
        </label>
        <p id="clip-file-error" role="alert" className="text-sm text-rose empty:hidden">
          {fileError}
        </p>
      </div>

      {poster && (
        <div className="grid gap-2">
          <span className={labelCls}>{labels.posterLabel}</span>
          <div className="clip-notch-sm grid aspect-video w-full max-w-sm place-items-center overflow-hidden border border-steel-line bg-void">
            {poster.status === "ready" ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
              <img src={poster.url} alt="" className="size-full object-cover" />
            ) : (
              <span className="px-4 text-center text-xs text-bone-faint" role="status">
                {poster.status === "pending" ? labels.posterPending : labels.posterFailed}
              </span>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-bone-faint">{labels.guidelines}</p>

      {busy && (
        <div className="grid gap-2" role="status" aria-live="polite">
          <div
            className="h-2 w-full overflow-hidden bg-steel-line"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className="h-full bg-crimson transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-bone-dim">
            {phase === "uploading" ? fill(labels.uploading, { percent: progress }) : labels.finishing}
          </span>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-rose">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy || !picked || poster?.status === "pending"}
          className="clip-notch-sm inline-flex items-center justify-center gap-2.5 bg-crimson px-6 py-3 font-display text-sm font-semibold tracking-[0.14em] text-white uppercase shadow-crimson-soft transition-all duration-300 hover:bg-crimson-hot hover:shadow-crimson disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {labels.submit}
        </button>
        {phase === "uploading" && (
          <button
            type="button"
            onClick={cancel}
            className="clip-notch-sm border border-steel-line px-6 py-3 font-display text-sm tracking-[0.14em] text-bone-dim uppercase hover:text-bone"
          >
            {labels.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
