"use client"
import { Footer, Navbar, Landing, Bookspage , Techoffers} from "@/components";
import { ToastContainer } from "react-toastify";


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
