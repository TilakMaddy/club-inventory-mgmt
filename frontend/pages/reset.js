import { useRouter } from "next/router";
import RequestReset from "../components/RequestReset";
import Reset from "../components/Reset";

export default function ResetPage() {

  const { query } = useRouter();

  if(!query?.token) {
    return <div>
      <RequestReset />
    </div>
  }

  return (
    <>
      <Reset />
    </>
  )

}