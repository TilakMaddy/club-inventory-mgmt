import { useRouter } from "next/dist/client/router";
import Pagination from "../../components/Pagination";
import DisplayError from "../../components/ErrorMessage";
import Products from "../../components/Products";
import { perPage } from "../../config";
import { PAGINATION_QUERY } from "../../components/Pagination";
import { useQuery } from "@apollo/client";
import { CenterIt } from "../404";

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export default function ProductsPage() {

  const { query } = useRouter();
  let page = parseInt(query.page);

  if(!page) page = 1;

  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  if (loading) return 'Loading...';
  if (error) return <DisplayError error={error} />;

  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);

  const imageSrc = ['https://www.memecreator.org/static/images/templates/1590190.jpg', 'https://cdn-img.scalabs.com.au/_KzDVZMqTADBWuNBBX1_5i0UWYJBkisbHH3PwbJuK6E/aHR0cHM6Ly9zdy1o/aXQtcHJkLnNjYWRp/Z2l0YWwuaW8vbWVk/aWEvMTYyNjYvc2lk/ZS1leWUtY2hsb2Uu/anBnP3ByZXNldD1t/cnByZXZhcnRpY2xl'];

  if(page > pageCount) {
    return <CenterIt>
      <h1> It dont exist Sherlock !</h1>
      <img src={imageSrc[getRandomIntInclusive(0, 1)]} />
    </CenterIt>
  }

  return <div>
    <Pagination page={page} />
    <Products page={page} />
    <Pagination page={page} />
  </div>
}
