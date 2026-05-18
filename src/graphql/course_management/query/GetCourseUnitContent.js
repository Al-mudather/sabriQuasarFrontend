import gql from 'graphql-tag'

// Single-content lookup. The classroom URL is keyed on a contentPk; on
// first arrival the rail needs to know which UNIT owns that contentPk so it
// can pre-expand and eager-load just that unit's lessons (instead of asking
// the user to click). We pull the parent unit pointer + a minimal payload.
export const GetCourseUnitContent = gql`
query GetCourseUnitContent($contentPk: Int!) {
  courseUnitContent(id: $contentPk) {
    id,
    pk,
    modelName,
    modelValue,
    courseUnit {
      id,
      pk
    }
  }
}
`
