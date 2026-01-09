export default function ErrorBoundary() {
  return (
    <div className="flex flex-col justify-start items-start p-[24px] w-[375px] text-left whitespace-normal tracking-[0px]">
      <div className="self-stretch shrink-0 flex flex-col justify-start items-start">
        页面缓存出现问题，请刷新页面重试
      </div>
    </div>
  );
}
