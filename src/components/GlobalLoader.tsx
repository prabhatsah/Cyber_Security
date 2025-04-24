export default function GlobalLoader() {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-lg">
                <div className="flex items-center gap-2 text-white">
                    <span className="global-loader"></span>
                </div>
            </div>
        </>
    )
}