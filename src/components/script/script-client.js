"use client"
import { useEffect } from 'react'

export default function ScriptClient() {
    useEffect(() => {
        require("../../../public/js/tiny-slider.js")
        require("../../../public/js/bootstrap.bundle.min.js")
        require("../../../public/js/custom.js")
    }, [])
  return null
}
