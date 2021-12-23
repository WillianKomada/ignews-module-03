import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  // verificação do className do link
  // Se asPath for igual href então activeClassName senão nada
  const className = asPath === rest.href ? activeClassName : "";

  return (
    <Link {...rest}>
      {cloneElement(children, {
        // clonei meu children e adicionei className (verificação)
        className,
      })}
    </Link>
  );
}

/* 

ActiveLinkProps = tipagem para as props de Link

...rest = recebe tudo o que o Link pode receber

activeClassName = seria meu novo className que recebe styles.active

children = são os filhos que vai dentro do elemento Link, tipado com ReactElement, 
que diz que recebe um elemento react

cloneElement = clona um elemente e modifica coisas nele

asPath = recebe qual o caminho do link

*/
