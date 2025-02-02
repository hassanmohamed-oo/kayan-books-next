"use client"
import { Footer,  Landing } from "@/components";
import { ToastContainer } from "react-toastify";
import Bookspage from "@/components/Books";
import Techoffers from "@/components/Techoffers";


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
