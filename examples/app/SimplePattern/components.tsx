import styled from 'styled-components';

export const NEXT = 'NEXT';
export const PREV = 'PREV';

export const Item = styled.div<{ img: string }>`
  text-align: center;
  padding: 100px;
  background-image: ${(props) => `url(${props.img})`};
  background-size: cover;
`;

export const CarouselContainer = styled.div<{ sliding: boolean }>`
  display: flex;
  transition: ${(props) => (props.sliding ? 'none' : 'transform 1s ease')};
  transform: ${(props) => {
    if (!props.sliding) return 'translateX(calc(-80% - 20px))';
    if (props.dir === PREV) return 'translateX(calc(2 * (-80% - 20px)))';
    return 'translateX(0%)';
  }};
`;

export const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  box-shadow: 5px 5px 20px 7px rgba(168, 168, 168, 1);
`;

export const CarouselSlot = styled.div<{ order: number }>`
  flex: 1 0 100%;
  flex-basis: 80%;
  margin-right: 20px;
  order: ${(props) => props.order};
`;

export const PatternBox = styled.p`
  border: 2px solid black;
  width: 60%;
  margin: 20px auto;
  padding: 30px 20px;
  white-space: pre-line;
`;

export const D = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? 'gold' : 'black')};
  padding: 3px;
`;
