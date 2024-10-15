import styled from "styled-components";

export const NEXT = "NEXT";
export const PREV = "PREV";

export const Item = styled.img<{ src: string }>`
  src: ${(props) => `url(${props.src})`}
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const CarouselContainer = styled.div<{ sliding: boolean }>`
  display: flex;
  transition: ${(props) => (props.sliding ? "none" : "transform 1s ease")};
  transform: ${(props) => {
    if (!props.sliding) return "translateX(calc(-80% - 20px))";
    if (props.dir === PREV) return "translateX(calc(2 * (-80% - 20px)))";
    return "translateX(0%)";
  }};
`;

export const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  box-shadow: 5px 5px 20px 7px rgba(168, 168, 168, 1);
`;

export const CarouselSlot = styled.div<{ order: number }>`
  flex: 1 0 80%;
  margin-right: 5px;
  order: ${(props) => props.order};
`;

export const SlideButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

export const SlideButton = styled.button<{ float: "left" | "right" }>`
  color: #ffffff;
  font-family: Open Sans;
  font-size: 16px;
  font-weight: 100;
  padding: 10px;
  background-color: #f66f3e;
  border: 1px solid white;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: none;

  &:active {
    position: relative;
    top: 1px;
  }
  &:focus {
    outline: 0;
  }
`;

export const PatternBox = styled.div`
  padding: 10px;
  border: 1px solid black;
  margin: 10px auto 20px auto;
  text-align: center;
`;

export const D = styled.span`
  padding: 3px;
`;
