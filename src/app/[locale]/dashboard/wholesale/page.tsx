import { Metadata } from "next";
import WholesaleInquiries from "./wholesale-inquiries";

export const metadata: Metadata = {
  title: "Wholesale Inquiries",
  description: "Manage wholesale inquiries",
};

export default function WholesaleDashboardPage() {
  return <WholesaleInquiries />;
}
