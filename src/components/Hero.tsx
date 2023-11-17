import { logo } from '../assets'

function Hero() {
  return (
    <section className="w-full flex items-center justify-center flex-col">
      <header className="flex justify-between items-center w-full mb-10 p-3">
        <img src={logo} alt="Sumz logo" className="w-28 object-contain" />

        <a
          target="_blank"
          href="https://github.com/cesarneo"
          rel="noreferrer"
          className="black_btn"
        >
          GitHub
        </a>
      </header>

      <h1 className="head_text">
        Summarize Articles with <br className="max-md:hidden" />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>

      <h2 className="desc">
        Simplify your reading with Summize, an open-source article summarizer
        that transforms lengthy articles into clear and concise summaries
      </h2>
    </section>
  )
}

export default Hero
