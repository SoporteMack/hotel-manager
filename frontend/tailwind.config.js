/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: 'oklch(96.7% 0.003 264.542)',
        secondary: '#868887',
        'text-primary': 'white',
        'text-secondary': 'black',
        'text-form': '#203360',
        'text-placeholder': '#6a7881',
        'focus-form': 'oklch(86.9% 0.005 56.366)',
        'shadow-primary': 'oklch(86.9% 0.005 56.366)',
        'form-primary': 'white',
        'input-primary': '#cae0eb96',
        'btn-primary': '#b2d1e5',
        'btn-hover-primary': '#a0c5db',
        'hover-primary': '#e6e8ea',
        'primary-header': 'white',
        'btn-delete':"",
        'btn-border-delete':"oklch(80.8% 0.114 19.571)",
        'btn-text-delete':"oklch(57.7% 0.245 27.325)",
        'btn-border-hover-delete':"oklch(57.7% 0.245 27.325)",
        'btn-text-hover-delete':"oklch(57.7% 0.245 27.325)",
        'btn-edit':"",
        'btn-border-edit':"oklch(87.2% 0.01 258.338)",
        'btn-text-edit':"oklch(37.3% 0.034 259.733)",
        'btn-border-hover-edit':"black",
        'btn-text-hover-edit':"black",
        'row-table-border':"#bcbcbc",
        'row-table-hover':"#ececf1",
        'btn-add':"black",
        'btn-border-add':"#c2c2c2 ",
        'btn-text-add':"white",
        'btn-border-hover-add':"black",
        'btn-text-hover-add':"black",
        'btn-add-hover':"white",
        'item-sidebar-active':"#f1f3f4",
        'error':"red",
        'title-section':"oklch(27.8% 0.033 256.848)",
        'description-section':"oklch(55.1% 0.027 264.364)",
        'btn-cancel-modal':"oklch(55.1% 0.027 264.364)"
      }
    },
  },
  plugins: [],
}

