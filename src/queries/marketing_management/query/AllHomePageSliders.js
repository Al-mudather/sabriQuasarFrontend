import gql from 'graphql-tag'

export const AllHomePageSliders = gql`
fragment CourseFragments on CourseNode {
  pk
  id
  title
  cover
  brief
}    
  

query AllHomePageSliders{

  allHomePageSliders(
    orderBy: ["-id"],
    isPublished: true
  ){

      edges {

          node {
              
            # here the slider is defined by fragments
            slide {
              ...CourseFragments
            }
            objectId
            id
            pk    
            isPublished
            startDate
            endDate
          }

      }

  }

}
`
