import { SimpleGrid } from "@chakra-ui/react"
import useAppContext from "../../../hooks/useAppContext"
import NewsCard from "./NewsCard"

const NewsView = () => {
  const { news } = useAppContext()
  
  return (
    <SimpleGrid columns={4} spacing={2}>
      {
        news.list?.map((e, i) => (
          <NewsCard key={i} data={e} />
        ))
      }
    </SimpleGrid>
  )
}

export default NewsView