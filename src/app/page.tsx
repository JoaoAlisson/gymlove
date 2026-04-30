import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <ProductGrid />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
