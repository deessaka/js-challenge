function Loader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
      <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse delay-150"></div>
      <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse delay-300"></div>
    </div>
  )
}

export default Loader
