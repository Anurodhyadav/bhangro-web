import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductsClientView from "./ProductsClientView";

export const revalidate = 10; // Revalidate static data every 10 seconds for instant response

async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items;
  } catch (error) {
    console.error("Server fetch error for products:", error);
    return [];
  }
}

export const metadata = {
  title: "Shop Collection | Sustainable Hemp Bags",
  description: "Browse all authentic handcrafted wild hemp bags and accessories made in Nepal.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductsClientView initialProducts={products} />;
}
