// Purpose: This file is used to configure the blog, including the author, title, description, and other settings.

import { PAGE_ROUTES } from "@/constants/API_ROUTES";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const siteData: any = {
  author: "AI Labs Blogs", // author name
  logo: {
    // how to change the favicon of the website?
    // change the app/favicon.ico file directly，or refer to the document below
    // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

    // you can use image or text as the logo, you can choose both, but the image will be displayed first
    image: "/AILabLogo.svg", //  the file path of the logo in the public directory
    text: "Blog", // null || text

    // whether the logo is a link to the home page
    isHomeLink: true, // true | false
  },

  // website title
  title: "Blog",

  // website description
  description: "A minimalist blog created with Next.js ,Shadcn-ui and Tailwind.css",

  // light | dark
  theme: "light",

  // your blog repo || your github repo || null
  githubRepo: "https://github.com/imyuanli/next-blog",

  // routes
  routes: [
    {
      name: "Home",
      value: PAGE_ROUTES.BLOGS,
    },
  ],

  // home page config
  home: {
    title: "Welcome to Blog",
    description: "A minimalist blog created with Next.js ,Shadcn-ui and Tailwind.css",

    socials: {
      email: "286547316@qq.com",
      github: "https://github.com/imyuanli",
      twitter: "https://twitter.com",
      linkedin: "",
      facebook: "",
      instagram: "",
      youtube: "",
    },
  },

  // blog page config
  blog: {
    title: "Changelog & Blogs",
    description: "Regarding the update logs of Blog, blogs, and others, etc.",
    comment: {
      enabled: true,
      engine: "giscus", // giscus | utterances
      // giscus doc: https://giscus.app
      giscus: {
        repo: "imyuanli/next-blog",
        repoId: "R_kgDOKTZ_kQ",
        category: "Announcements",
        categoryId: "DIC_kwDOKTZ_kc4CfMXK",
        mapping: "pathname",
        reactionsEnabled: "1",
        emitMetadata: "0",
        inputPosition: "top",
        theme: "light",
        lang: "en",
        loading: "lazy",
      },

      // utterances doc: https://utteranc.es
      utterances: {
        src: "https://utteranc.es/client.js",
        repo: "imyuanli/next-blog",
        "issue-term": "pathname",
        theme: "github-light",
        crossorigin: "anonymous",
        label: "",
        async: true,
      },
    },
    pagination: {
      enabled: true,
      pageSize: 5,
      engine: "default", // default:pagination button | loadMore:loading more button
    },
  },

  // tags page config
  editPanel: {
    title: "Create Blog",
    description: "Generate Blog and publish to site",
  },

  // project page config
  project: {
    title: "Look what I've done",
    description: "Some small tools made by oneself",

    // status color and text
    getStatus: (status: string) => {
      // you can customize the status color and text！

      // dev: Under development or planning.
      // active: Currently focused on this project.
      // filed: Not upgrading will only fix bugs.
      // offline: Going offline soon.
      // none: Keep running.
      if (!status) return {};

      switch (status) {
        case "active":
          return {
            variant: "default",
            text: "ACTIVE",
          };
        case "dev":
          return {
            variant: "secondary",
            text: "DEV",
          };
        case "filed":
          return {
            variant: "outline",
            text: "FILED",
          };
        case "offline":
          return {
            variant: "destructive",
            text: "OFFLINE",
          };
      }
    },

    // name, description, href are required
    // github: username/repo
    // status: getStatus return value
    // and so on
    // you can add more fields according to your needs ,but you need to modify the code in the project/page.tsx file
    projects: [
      {
        name: "Blog",
        description: "A minimalist blog created with Next.js ,Shadcn-ui and Tailwind.css",
        href: "https://next-blog.imyuanli.cn",
        github: "imyuanli/next-blog",
        status: "active",
      },
      {
        name: "AllDone",
        description: "One stop project management platform",
        status: "dev",
      },
      {
        name: "Slash Editor",
        description: "A simple rich text editor",
        href: "https://slash.imyuanli.cn",
        github: "imyuanli/slash-editor",
      },
      {
        name: "RMX",
        description:
          "Readme is an online editor that can help developers quickly create README.md for their projects, while also meeting some templates for Github personal pages",
        href: "https://readme.imyuanli.cn/",
        github: "imyuanli/readme",
        status: "filed",
      },
      {
        name: "Resume",
        description: "A simple resume template",
        href: "https://resume.imyuanli.cn/",
        github: "imyuanli/resume",
        status: "offline",
      },
    ],
  },

  // search config
  search: {
    enabled: true,
    engine: "cmdk", //  cmdk | algolia
    // todo algolia search
    // algolia: {
    //     appId: "",
    //     apiKey: "",
    // }
  },

  // footer config
  footer: {
    isShow: true,
    // whether to display the "Powered by Blog" in the footer，you can set it to false，but I hope you can keep it，thank you！
    isShowPoweredBy: true,
  },
};

export default siteData;
