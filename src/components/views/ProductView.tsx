import { PRODUCTS } from "@/configuration/query_keys";
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableProductItem from "../SortableProductItem";
import { fetchAllProducts } from "@/services/products/productListService";
import {
  Product,
  ProductApiResponse,
} from "@/services/products/productListModels";
import { updateProductActiveStatus } from "@/utils/updateProductStatus";

function ProductView() {
  const { data, isLoading, isError, error } = useQuery<ProductApiResponse>({
    queryKey: [PRODUCTS],
    queryFn: fetchAllProducts,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gridRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (data?.data) {
      const products = data.data.map((item) => ({ ...item, active: false }));
      setProducts(products);
    }
  }, [data]);

  useEffect(() => {
    if (activeIndex !== null) {
      gridRef.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (activeIndex === null) return;

    let newIndex = activeIndex;

    switch (event.key) {
      case "ArrowUp":
        newIndex = activeIndex - 4; // Move up in the grid
        break;
      case "ArrowDown":
        newIndex = activeIndex + 4; // Move down in the grid
        break;
      case "ArrowLeft":
        newIndex = activeIndex - 1; // Move left in the grid
        break;
      case "ArrowRight":
        newIndex = activeIndex + 1; // Move right in the grid
        break;
      default:
        return;
    }

    if (newIndex >= 0 && newIndex < products.length) {
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    //@ts-ignore
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      //@ts-ignore
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex(
        (product) => product.id === active.id
      );
      const newIndex = products.findIndex((product) => product.id === over.id);
      console.log(oldIndex, newIndex, "indexes");
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedProducts = [...products];
        const temp = updatedProducts[oldIndex];
        updatedProducts[oldIndex] = updatedProducts[newIndex];
        updatedProducts[newIndex] = temp;

        setProducts(updatedProducts);
      }
    }
  };

  const handleActivateProduct = (id: number) => {
    const updatedProducts = updateProductActiveStatus(products, id);
    setProducts(updatedProducts);
  };
  console.log(products, "pro");
  // Create sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext
          items={products.map((product) => product.id)}
          strategy={verticalListSortingStrategy}
        >
          <Grid container spacing={2}>
            {products.map((product, index) => (
              <SortableProductItem
                product={product}
                key={product.id}
                onClick={() => {
                  handleActivateProduct(product.id);
                  setActiveIndex(index);
                }}
                style={{
                  outline: index === activeIndex ? "3px solid #A0153E" : "none",
                }}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
    </Container>
  );
}

export default ProductView;
