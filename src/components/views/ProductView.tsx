import { PRODUCTS } from "@/configuration/query_keys";
import {
  Container,
  Grid,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (data?.data) {
      const products = data.data.map((item) => ({ ...item, active: false }));
      setProducts(products);
    }
  }, [data]);

  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let columnCount = 1;

    if (containerWidth >= 1536) {
      columnCount = 4;
    } else if (containerWidth >= 1200) {
      columnCount = 4;
    } else if (containerWidth >= 960) {
      columnCount = 4;
    } else if (containerWidth >= 600) {
      columnCount = 2;
    } else if (containerWidth >= 0) {
      columnCount = 1;
    }

    setColumns(columnCount);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (activeIndex === null) return;

    let newIndex = activeIndex;

    switch (event.key) {
      case "ArrowUp":
        newIndex = activeIndex - columns; // Move up in the grid
        break;
      case "ArrowDown":
        newIndex = activeIndex + columns; // Move down in the grid
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
    window.addEventListener("resize", calculateColumns);
    calculateColumns();

    return () => {
      window.removeEventListener("resize", calculateColumns);
    };
  }, [calculateColumns]);

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
      <Container
        sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}
        ref={containerRef}
      >
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
