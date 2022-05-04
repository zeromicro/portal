import clsx from "clsx"
import Highlight from "../components/Highlight"
import React from "react"
import Customers from "../components/Customers"
import customFields from "../config/customFields"

import Button from "@theme/Button"
import Layout from "../theme/Layout"
import SvgImage from "../components/SvgImage"

import doCss from "../css/index/docker.module.css"
import feCss from "../css/index/feature.module.css"
import juCss from "../css/index/jumbotron.module.css"
import shCss from "../css/index/showcase.module.css"
import usCss from "../css/index/usp.module.css"
import seCss from "../css/section.module.css"
import useBaseUrl from "@docusaurus/useBaseUrl"
import GithubLogo from "../assets/img/github.svg"
import Translate, { translate } from "@docusaurus/Translate"

const Top = () => {
  return (
    <section
      className={clsx(seCss["section--inner"], seCss["section--slim--accent"])}
    >
      <div className={juCss.jumbotron}>
        <h1
          className={clsx(
            seCss.section__title,
            seCss["section__title--jumbotron"],
            seCss["section__title--accent"],
          )}
        >
          <Translate>Make development easy</Translate>
        </h1>

        <p
          className={clsx(
            seCss.section__subtitle,
            seCss["section__subtitle--jumbotron"],
            seCss["section__subtitle--accent"],
          )}
        >
          <Translate>
            go-zero is a web and rpc framework that with lots of engineering
            practices builtin
          </Translate>
        </p>

        <div className={juCss.jumbotron__github}>
          <img
            alt="stars"
            height={30}
            src="https://img.shields.io/github/stars/zeromicro/go-zero?style=social"
            className={juCss.star__fork}
          />
          <img
            alt="forks"
            height={30}
            src="https://img.shields.io/github/forks/zeromicro/go-zero?style=social"
            className={juCss.star__fork}
          />
        </div>

        <div className={juCss.jumbotron__cta}>
          <Button className={juCss.jumbotron__link} href={customFields.demoUrl}>
            <Translate>GETTING STARTED</Translate>
          </Button>
          <Button
            className={clsx(
              juCss.jumbotron__link,
              juCss["jumbotron__cta--github"],
            )}
            href={customFields.githubUrl}
            icon={<SvgImage image={<GithubLogo />} title="GitHub" />}
            variant="secondary"
          >
            <Translate>GitHub</Translate>
          </Button>
        </div>
      </div>

      <div className={doCss.docker}>
        <img
          src={useBaseUrl(
            translate({
              message: "/img/pages/index/arch.svg",
            }),
          )}
          alt="arch"
        />
      </div>
    </section>
  )
}

const Usp = () => (
  <section className={clsx(seCss.section, seCss["section--odd"])}>
    <div className={seCss["section--inner"]}>
      <div className={usCss.usp}>
        <div className={usCss.usp__inner}>
          <img
            alt="performance"
            className={usCss.usp__illustration}
            height={113}
            src={useBaseUrl("/img/pages/index/performance.svg")}
            width={176}
          />

          <h2 className={usCss.usp__title}>
            <Translate>High Performance</Translate>
          </h2>

          <p className={usCss.usp__description}>
            <Translate>builtin service discovery, load balancing</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>builtin concurrency control</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>adaptive circuit breaker</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>adaptive load shedding</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>auto trigger, auto recover</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>chained timeout control</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>auto management of data caching</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>call tracing, metrics and monitoring</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>high concurrency protectedg</Translate>
          </p>
        </div>
      </div>

      <div className={clsx(usCss.usp, usCss["usp--wide"])}>
        <div className={usCss.usp__inner}>
          <img
            alt="extension"
            className={usCss.usp__illustration}
            height={113}
            src={useBaseUrl("/img/pages/index/extension.svg")}
            width={176}
          />

          <h2 className={usCss.usp__title}>
            <Translate>Easy to expand</Translate>
          </h2>
          <p className={usCss.usp__description}>
            <Translate>middlewares are supported, easy to extend</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>
              failure-oriented programming, resilience design
            </Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>fully compatible with net/http</Translate>
          </p>
        </div>
      </div>

      <div className={usCss.usp}>
        <div className={usCss.usp__inner}>
          <img
            alt="easy-to-use"
            className={usCss.usp__illustration}
            height={113}
            src={useBaseUrl("/img/pages/index/easyToUse.svg")}
            width={176}
          />

          <h2 className={usCss.usp__title}>
            <Translate>Easy to learn</Translate>
          </h2>

          <p className={usCss.usp__description}>
            <Translate>powerful tool included, less code to write</Translate>
          </p>
          <p className={usCss.usp__description}>
            <Translate>
              plenty of builtin microservice management and concurrent toolkits
            </Translate>
          </p>
        </div>
      </div>
    </div>
  </section>
)

const Cards = () => (
  <section className={clsx(seCss.section, seCss["section--odd"])}>
    <div className={clsx(seCss["section--inner"], seCss["section--center"])}>
      <h3
        className={clsx(
          seCss.section__title,
          feCss["section__title--wide"],
          "text--center",
        )}
      >
        <Translate>Why go-zero?</Translate>
      </h3>

      <div
        className={clsx(
          seCss.section__footer,
          seCss["section__footer--feature-cards"],
        )}
      >
        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>
            <Translate>Golang based</Translate>
          </h3>
          <p className={feCss.feature__content}>
            <ul>
              <li>
                <Translate>great performance</Translate>
              </li>
              <li>
                <Translate>simple syntax</Translate>
              </li>
              <li>
                <Translate>proven engineering efficiency</Translate>
              </li>
              <li>
                <Translate>extreme deployment experience</Translate>
              </li>
              <li>
                <Translate>less server resource consumption</Translate>
              </li>
            </ul>
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>
            <Translate>Self-designed microservice architecture</Translate>
          </h3>
          <p className={feCss.feature__content}>
            <ul>
              <li>
                <Translate>
                  rich experience on designing microservice architectures
                </Translate>
              </li>
              <li>
                <Translate>easy to location the problems</Translate>
              </li>
              <li>
                <Translate>easy to extend the features</Translate>
              </li>
            </ul>
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>
            <Translate>Rich features</Translate>
          </h3>
          <p className={feCss.feature__content}>
            <ul>
              <li>
                <Translate>
                  improve the stability of the services with tens of millions of
                  daily active users
                </Translate>
              </li>
              <li>
                <Translate>
                  builtin chained timeout control, concurrency control, rate
                  limit, adaptive circuit breaker, adaptive load shedding, even
                  no configuration needed
                </Translate>
              </li>
              <li>
                <Translate>
                  builtin middlewares also can be integrated into your
                  frameworks
                </Translate>
              </li>
              <li>
                <Translate>
                  simple API syntax, one command to generate couple of different
                  languages
                </Translate>
              </li>
              <li>
                <Translate>
                  auto validate the request parameters from clients
                </Translate>
              </li>
              <li>
                <Translate>
                  plenty of builtin microservice management and concurrent
                  toolkits
                </Translate>
              </li>
            </ul>
          </p>
        </div>

        <div className={feCss.feature}>
          <h3 className={feCss.feature__header}>
            <Translate>Design principles</Translate>
          </h3>
          <p className={feCss.feature__content}>
            <ul>
              <li>
                <Translate>keep it simple</Translate>
              </li>
              <li>
                <Translate>high availability</Translate>
              </li>
              <li>
                <Translate>stable on high concurrency</Translate>
              </li>
              <li>
                <Translate>easy to extend</Translate>
              </li>
              <li>
                <Translate>
                  resilience design, failure-oriented programming
                </Translate>
              </li>
              <li>
                <Translate>
                  try best to be friendly to the business logic development,
                  encapsulate the complexity
                </Translate>
              </li>
              <li>
                <Translate>one thing, one way</Translate>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  </section>
)

const goctlHelp = `$ goctl --help

NAME:
   goctl - a cli tool to generate code

USAGE:
   goctl [global options] command [command options] [arguments...]

VERSION:
   1.3.5 darwin/amd64

COMMANDS:
   bug         report a bug
   upgrade     upgrade goctl to latest version
   env         check or edit goctl environment
   migrate     migrate from tal-tech to zeromicro
   api         generate api related files
   docker      generate Dockerfile
   kube        generate kubernetes files
   rpc         generate rpc code
   model       generate model code
   template    template operation
   completion  generation completion script, it only works for unix-like OS
   help, h     Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version`

const QueryScroller = () => {
  return (
    <section
      className={clsx(
        seCss.section,
        seCss["section--inner"],
        seCss["section--center"],
        seCss["section--showcase"],
      )}
    >
      <h2
        className={clsx(
          seCss.section__title,
          seCss["section__title--wide"],
          "text--center",
        )}
      >
        <Translate>Code Generation</Translate>
      </h2>

      <p
        className={clsx(
          seCss.section__subtitle,
          seCss["section__subtitle--narrow"],
          "text--center",
        )}
      >
        <Translate>
          go-zero includes a minimalist API definition and generation tool
          goctl, which can generate Go, iOS, Android, Kotlin, Dart, TypeScript,
          JavaScript code according to the defined api file with one click, and
          run it directly.
        </Translate>
      </p>

      <div className={shCss.showcase}>
        <Highlight code={goctlHelp} />
      </div>
    </section>
  )
}

const Home = () => {
  return (
    <Layout
      canonical=""
      description={customFields.description}
      title={customFields.title}
      replaceTitle
    >
      <Top />
      <Customers nbElements={6} />
      <Usp />
      <QueryScroller />
      <Cards />
    </Layout>
  )
}

export default Home
