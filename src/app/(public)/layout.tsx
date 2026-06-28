import Header from "@/src/components/header";
import { Footer } from "@/src/components/footer";
import { Questions } from "@/src/components/questions";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Questions />
            <Footer />
        </>
    );
}
