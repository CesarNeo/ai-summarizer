import {
  Children,
  ElementRef,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

type Article = {
  url: string
  summary: string
}

function Demo() {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [articleSummary, setArticleSummary] = useState('')
  const [copied, setCopied] = useState<string | undefined>(undefined)

  const inputURLRef = useRef<ElementRef<'input'>>(null)

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()
  const errorSummary = error as { data: { error: string } }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const articleURL = inputURLRef.current?.value

    if (articleURL) {
      const { data } = await getSummary({ articleURL })

      if (data?.summary) {
        setAllArticles((prev) => {
          const newArticle = {
            url: articleURL,
            summary: data.summary,
          }
          const newArticles = [...prev, newArticle]
          setArticleSummary(data.summary)

          localStorage.setItem('articles', JSON.stringify(newArticles))

          return newArticles
        })
      }
    }
  }

  function handleSelectArticle(article: Article) {
    setArticleSummary(article.summary)
    inputURLRef.current!.value = article.url
  }

  function handleCopy(url: string) {
    setCopied(url)
    navigator.clipboard.writeText(url)

    setTimeout(() => {
      setCopied(undefined)
    }, 2000)
  }

  useEffect(() => {
    const articlesLocalStorage = JSON.parse(
      localStorage.getItem('articles') || '[]',
    )

    if (articlesLocalStorage.length) {
      setAllArticles(articlesLocalStorage)
    }
  }, [])

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="Link icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            ref={inputURLRef}
            type="url"
            placeholder="Enter a URL"
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            📝
          </button>
        </form>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {Children.toArray(
            allArticles.map((article) => (
              <button
                type="button"
                onClick={() => handleSelectArticle(article)}
                className="link_card text-start"
              >
                <button
                  type="button"
                  onClick={() => handleCopy(article.url)}
                  className="copy_btn"
                >
                  <img
                    src={copied === article.url ? tick : copy}
                    alt="Copy icon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </button>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {article.url}
                </p>
              </button>
            )),
          )}
        </div>
      </div>

      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="Loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn&apos;t supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {errorSummary.data.error}
            </span>
          </p>
        ) : (
          articleSummary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>

              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {articleSummary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo
