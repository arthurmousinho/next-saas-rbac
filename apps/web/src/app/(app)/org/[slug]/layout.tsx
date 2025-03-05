import Header from "@/components/header";

export default async function OrgLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
            <header className="pt-6">
                <Header />
            </header>
            <main className="mx-auto w-full max-w-[1200px] py-4">
                {children}
            </main>
        </div>
    );

}