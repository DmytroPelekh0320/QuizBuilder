import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/quizzes",
    permanent: false
  }
});

export default function Home() {
  return null;
}
