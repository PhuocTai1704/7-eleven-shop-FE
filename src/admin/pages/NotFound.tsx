import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const orbitRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let angle = 0;
    let rafId: number;

    const animate = () => {
      angle += 0.6;
      if (orbitRef.current) {
        orbitRef.current.style.transform = `rotate(${angle}deg)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex flex-col items-center justify-center px-4 py-16 text-center font-sans">
      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-violet-400 opacity-[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-10 w-48 h-48 rounded-full bg-violet-400 opacity-[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] right-[10%] w-28 h-28 rounded-full bg-violet-400 opacity-[0.07]"
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        {/* Label */}
        <span className="mb-5 inline-block rounded-md bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-violet-300">
          lỗi trang
        </span>

        {/* 4 0 4 */}
        <div
          aria-label="404"
          className="mb-4 flex items-center justify-center leading-none"
        >
          <span className="text-[120px] font-black tracking-tighter text-slate-900 leading-none -mr-1">
            4
          </span>

          {/* Spinning orbit ring */}
          <div
            ref={orbitRef}
            aria-hidden="true"
            className="relative mx-[-4px] inline-block h-[110px] w-[110px] shrink-0 rounded-full border-[3px] border-violet-400"
          >
            <div className="absolute -top-[9px] left-1/2 h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-violet-400" />
          </div>

          <span className="text-[120px] font-black tracking-tighter text-slate-900 leading-none -ml-1">
            4
          </span>
        </div>

        {/* Divider */}
        <div className="mb-5 h-0.5 w-10 rounded-full bg-violet-400 opacity-40" />

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Trang không tìm thấy
        </h1>

        {/* Description */}
        <p className="mb-8 text-[15px] font-light leading-relaxed text-gray-500">
          Trang bạn đang tìm kiếm có thể đã bị xóa,
          <br />
          đổi tên hoặc tạm thời không khả dụng.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-7 py-3 text-[15px] font-semibold text-white transition-all hover:bg-violet-400 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            🏠 Về trang chủ
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-transparent px-5 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-800"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
