"use client"
import { Footer,  Landing, bookspage , Techoffers} from "@/components";
import { ToastContainer } from "react-toastify";


export default function Home() {
  return (
    <>
      <ToastContainer />
      <Landing />
      <bookspage />
      <Techoffers />
      <Footer />
    </>
  );
}
