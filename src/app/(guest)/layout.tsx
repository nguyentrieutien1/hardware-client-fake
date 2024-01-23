import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "~/components/pages/guest/header/header";
import Footer from "~/components/pages/guest/footer/footer";
import "../../../public/css/font-awesome.min.css";
import { Metadata } from "next";
import "../../../public/css/style.css";
import "../../../public/css/bootstrap.min.css";
export const metadata: Metadata = {
  title: "Máy tính Thu Nguyễn",
  icons: "https://maytinhthunguyen.com/api/upload/1705643045785-625737817.png",
};

export const viewport = {
  width: 1,
  themeColor: "light",
};
 function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
export default GuestLayout