import { Card, CardContent, Grid, Typography, styled } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/services/products/productListModels";

// Define the props type for SortableProductItem
interface SortableProductItemProps {
  product: Product;
}

function SortableProductItem({ product }: SortableProductItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...styles.card, // Apply default styles
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.id}>
      <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div style={{ position: "relative", width: "100%", height: "180px" }}>
          <Image
            src={product.image}
            alt={product.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent>
          <TruncatedTypography variant="h6">
            {product.title}
          </TruncatedTypography>
        </CardContent>
      </Card>
    </Grid>
  );
}

const TruncatedTypography = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

const styles = {
  card: {
    cursor: "grab",
    marginBottom: "16px", // Add margin to separate items
  },
};

export default SortableProductItem;
