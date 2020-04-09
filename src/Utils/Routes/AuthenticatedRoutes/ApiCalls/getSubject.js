import createGetOptions from "../../../FetchOptions/Get";

export default async function getSubject(subjectId) {
  const url = `/subject?id=${subjectId}`;
  const getOptions = createGetOptions();
  let subject;
  try {
    subject = await fetch(url, getOptions);
    // subject = await subject.json();
  } catch (error) {
    console.log("within fetching subject", error);
  }
  return subject;
}
