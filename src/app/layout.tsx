"use client"
import { Inter } from "next/font/google";
import "./../../public/css/tiny-slider.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "~/lib/helpers/provider";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { useRef } from "react";
import { AppStore, makeStore } from "~/lib";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Provider store={storeRef.current}>
          <Providers>{children}</Providers>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
