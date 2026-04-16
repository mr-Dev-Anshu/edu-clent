"use client";

import { useState, useCallback } from "react";
import { ConfirmOptions } from "@/types";

export const useConfirm = () => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isOpen, setIsOpen]   = useState(false);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    await options?.onConfirm();
    setIsOpen(false);
  }, [options]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { confirm, isOpen, options, handleConfirm, handleCancel };
};