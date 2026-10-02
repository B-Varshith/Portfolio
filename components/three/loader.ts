"use client";

import dynamic from "next/dynamic";

/**
 * Three.js is pulled into its own chunk and only requested when the component
 * actually renders. The page stays fully usable before any of this lands.
 */

const Noop = () => null;

export const LazyHeroCore = dynamic(() => import("./HeroCore"), {
  ssr: false,
  loading: Noop,
});

export const LazyNeuralNetwork = dynamic(() => import("./NeuralNetwork"), {
  ssr: false,
  loading: Noop,
});

export const LazyProjectOrbit = dynamic(() => import("./ProjectOrbit"), {
  ssr: false,
  loading: Noop,
});

export const LazyDeveloperCore = dynamic(() => import("./DeveloperCore"), {
  ssr: false,
  loading: Noop,
});
