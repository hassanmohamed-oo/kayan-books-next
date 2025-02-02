"use client"
import { Footer,  Landing } from "@/components";
import { ToastContainer } from "react-toastify";
import Bookspage from "@/app/Books/page";
import Techoffers from "@/app/Techoffers/page";


export default function Home() {
  return (
    <>
      <ToastContainer />
      <Landing />
      <Bookspage />
      <Techoffers />
      <Footer />
    </>
  );
}
