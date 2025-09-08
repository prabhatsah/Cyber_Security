export default function LoaderWithoutBackdrop() {
    return (
        <>
            <div className="z-10 absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                    <span className="loader-without-backdrop"></span>
                </div>
            </div>
        </>
    )
}