export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050816] selection:bg-cyan-500/30">
            {/* A simpler, cleaner background for the dashboard */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(5,8,22,1))] -z-10" />
            {children}
        </div>
    );
}
