import { Metadata } from "next";
import WholesaleForm from "./wholesale-form";

export const metadata: Metadata = {
  title: "Wholesale Inquiry",
  description: "Submit your wholesale inquiry for bulk orders",
};

export default function WholesalePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wholesale Inquiry</h1>
        <p className="text-muted-foreground">
          Interested in purchasing our products at wholesale rates? Fill out the form below and we'll get back to you.
        </p>
      </div>
      <WholesaleForm />
    </div>
  );
}
