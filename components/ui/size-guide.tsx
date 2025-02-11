'use client'

import React, { useState } from 'react'
import { X, Ruler } from 'lucide-react'

interface SizeGuideProps {
  category: 'shirts' | 'hoodies' | 'pants'
}

const sizeCharts = {
  shirts: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
    rows: [
      ['S', '36-38', '28', '24'],
      ['M', '39-41', '29', '24.5'],
      ['L', '42-44', '30', '25'],
      ['XL', '45-47', '31', '25.5'],
      ['2XL', '48-50', '32', '26'],
    ],
  },
  hoodies: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
    rows: [
      ['S', '38-40', '27', '25'],
      ['M', '41-43', '28', '25.5'],
      ['L', '44-46', '29', '26'],
      ['XL', '47-49', '30', '26.5'],
      ['2XL', '50-52', '31', '27'],
    ],
  },
  pants: {
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    rows: [
      ['S', '28-30', '36-38', '30'],
      ['M', '31-33', '39-41', '31'],
      ['L', '34-36', '42-44', '32'],
      ['XL', '37-39', '45-47', '33'],
      ['2XL', '40-42', '48-50', '34'],
    ],
  },
}

export function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const chart = sizeCharts[category]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-sm text-primary hover:text-primary/90"
      >
        <Ruler className="w-4 h-4 mr-1" />
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-background rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-foreground/60 hover:text-foreground"
            >
              <X size={20} />
              <span className="sr-only">Close size guide</span>
            </button>

            <h2 className="text-2xl font-bold mb-4">Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {chart.headers.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 text-left font-medium bg-muted"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row, index) => (
                    <tr key={index} className="border-b">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-foreground/60">
              <p>Measurements are approximate. For best results, measure yourself and compare to the size chart.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 