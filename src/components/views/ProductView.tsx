import { PRODUCTS } from "@/configuration/query_keys";
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ProductItem from "../SortableProductItem";
import { fetchAllProducts } from "@/services/products/productListService";
import {
  Product,
  ProductApiResponse,
} from "@/services/products/productListModels";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import SortableProductItem from "../SortableProductItem";

function ProductView() {
  const { data, isLoading, isError, error } = useQuery<ProductApiResponse>({
    queryKey: [PRODUCTS],
    queryFn: fetchAllProducts,
  });

  const productList: Product[] = data?.data || [];

  const handleDragEnd = (event: DragEndEvent) => {
    // Handle the logic for reordering products
    console.log("Drag End Event:", event);
  };

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
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={productList.map((product) => product.id)}
          strategy={verticalListSortingStrategy}
        >
          <Grid container spacing={2}>
            {productList.map((product) => (
              <SortableProductItem product={product} key={product.id} />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
    </Container>
  );
}

export default ProductView;
