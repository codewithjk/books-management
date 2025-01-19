"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navItem";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const FloatingNav = ({
  navItems,
  className,
  handleSearch,
}: {
  navItems?: NavItem[];
  className?: string;
  handleSearch: (query: string) => void;
}) => {


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.3,
        }}
        className={cn(
          "fixed top-0 inset-x-0 mx-auto z-[5000] p-4 flex justify-between items-center space-x-4 bg-white dark:bg-black shadow-md rounded-lg",
          className
        )}
      >
        <h1 className="text-xl font-bold">BOOK STORE</h1>
        {/* Search bar */}
        <div className="relative flex flex-1 flex-shrink-0">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={"search ..."}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

        {/* Login button */}
        <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
