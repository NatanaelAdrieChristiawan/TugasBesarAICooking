# AI Cooking Assistant - Design Guidelines

## Tema & Warna

### Light Theme
- Background: #ffffff (putih bersih)
- Card Background: #ffffff 
- Text: #0f172a (abu gelap)
- Muted: #f1f5f9 (abu terang)
- Border: rgba(0, 0, 0, 0.1)

### Dark Theme  
- Background: #0f172a (navy gelap)
- Card Background: #1e293b (abu slate gelap)
- Text: #f8fafc (putih lembut)
- Muted: #334155 (abu slate)
- Border: #334155

### Color Palette Utama
- Primary Green: #4CAF50 (untuk CTA dan elemen penting)
- Accent Amber: #FFC107 (untuk highlight dan ikon)
- Error/Destructive: #d4183d

## Typography

### Hierarki Font
- H1: 2xl, medium weight
- H2: xl, medium weight  
- H3: lg, medium weight
- Body/Chat: base, normal weight
- Button: base, medium weight

### Responsivitas
- Mobile: text-sm untuk input, text-4xl untuk judul
- Desktop: text-base untuk input, text-7xl untuk judul

## Layout & Spacing

### Grid & Container
- Max width: 4xl (max-w-4xl) untuk chat interface
- Max width: 6xl (max-w-6xl) untuk intro slides
- Padding: px-3 md:px-4 (mobile-first)
- Gap: gap-2 md:gap-3 (responsif)

### Mobile Optimizations
- Touch target minimum 44px (w-10 h-10 md:w-12 md:h-12)
- Input font-size: 16px (mencegah zoom di iOS)
- Viewport height menggunakan visualViewport API
- Gesture support: swipe untuk navigasi slides

## Component Guidelines

### Button
- Primary: bg-green-500 dengan hover:bg-green-600
- Ghost: variant="ghost" untuk theme toggle
- Round: rounded-full untuk floating action buttons
- Disabled: bg-muted dengan cursor-not-allowed

### Chat Messages
- User: bg-green-500 text-white, aligned right
- AI: bg-card border border-border, aligned left
- Max width: mobile max-w-[280px], desktop max-w-lg
- Avatar: 7x7 mobile, 8x8 desktop

### Input & Forms
- Border: border-border dengan focus:border-green-500
- Rounded: rounded-full untuk chat input
- Padding: px-4 md:px-6 py-2 md:py-3

### Animation Guidelines
- Duration: 0.3s untuk micro-interactions
- Duration: 0.8s untuk page transitions
- Easing: ease-in-out untuk smooth transitions
- Scale effects: hover:scale-105 untuk buttons

## Dark/Light Theme Implementation

### Theme Provider
- Menggunakan React Context untuk state management
- localStorage untuk persistensi tema
- System preference detection sebagai fallback
- Document class manipulation (light/dark)

### Theme-aware Classes
- Gunakan semantic colors: bg-background, text-foreground
- Avoid hardcoded colors seperti bg-white, text-black
- Muted elements: bg-muted text-muted-foreground
- Cards: bg-card text-card-foreground

## Mobile-First Guidelines

### Breakpoints
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)

### Touch Interactions
- Minimum touch target: 44px
- Prevent text selection: select-none untuk UI elements
- Touch feedback: transition-colors untuk buttons
- Gesture support: touchstart/touchend events

### Responsive Patterns
- Stack pada mobile, side-by-side pada desktop
- order-1 order-2 untuk reordering mobile content
- text-center md:text-left untuk alignment
- space-y-4 md:space-y-6 untuk responsive spacing

## Performance Optimizations

### Images
- Gunakan ImageWithFallback component
- Lazy loading dengan loading="lazy"
- Responsive sizes dengan object-cover

### Animations
- passive: true untuk event listeners
- requestAnimationFrame untuk smooth animations
- Debounced scroll/wheel events
- setTimeout untuk controlling animation frequency

### Mobile Specific
- Disable pull-to-refresh: overscroll-behavior: none
- Prevent zoom: font-size: 16px untuk inputs
- Visual viewport API untuk proper height calculation
- Touch optimizations: -webkit-tap-highlight-color: transparent