import { useRouter } from "next/dist/client/router";
import Store from "../../components/Store";
import Title from "../../components/styles/Title";
import Link from "next/link";

export default function StorePage() {

  const { query } = useRouter();

  return <div>

    <div style={{
      zIndex: 10,
      padding: 50,
    }}>

      <Title>
        <Link href={{ pathname: `/store/${query.id}`, query: { name: query.name }}}>
          {`Items that were added by ${query.name}`}
        </Link>
      </Title>

    </div>

    <Store sellerId={query.id} />
  </div>
}
