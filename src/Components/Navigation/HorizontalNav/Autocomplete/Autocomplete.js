import React, { useState } from "react";

import { MenuItem, Button } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";

// This is not at all what the data will look like in the end
const mockData = [
  {
    _id: "5e98e0223538ed17bad31118",
    title:
      "Proident Lorem proident excepteur officia aute ipsum sunt eu magna non. Nisi labore amet proident cupidatat officia ea aliqua reprehenderit et excepteur magna. Commodo culpa aliqua et ad cupidatat veniam reprehenderit ipsum laborum veniam ullamco ullamco velit.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e02296fa101b18b31c19",
    title:
      "Ullamco deserunt veniam qui reprehenderit enim cupidatat ullamco tempor duis. Eu veniam sunt laborum occaecat occaecat minim dolor sunt eu incididunt incididunt est cillum eu. Do laborum cupidatat laborum esse sit ad aliqua ipsum cillum sint quis. Id nulla exercitation reprehenderit laboris cupidatat elit et consectetur aute mollit non reprehenderit culpa proident.\r\n",
    type: "green",
  },
  {
    _id: "5e98e022bd054866833faffa",
    title:
      "Aliqua adipisicing cupidatat sit nostrud quis commodo Lorem amet Lorem sunt occaecat fugiat. Qui laborum est laborum nisi irure aliquip veniam incididunt est minim ipsum ad. Enim qui culpa culpa culpa eiusmod exercitation sint veniam. Nulla eu aliquip et quis consectetur Lorem qui aute mollit qui occaecat exercitation ex incididunt.\r\n",
    type: "green",
  },
  {
    _id: "5e98e02234d6b6720d457fa3",
    title:
      "Ut magna nulla cupidatat sint eu. Voluptate elit veniam irure tempor sit veniam officia reprehenderit eu consectetur amet reprehenderit. Aliqua aute nisi amet eiusmod sint proident laboris occaecat deserunt est duis exercitation excepteur qui.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022c754b3f9986a6a28",
    title:
      "Officia exercitation enim Lorem duis non quis commodo cupidatat aute Lorem fugiat enim nisi exercitation. Nulla tempor veniam amet deserunt ad non. Occaecat esse dolor nostrud amet est reprehenderit qui cupidatat pariatur. Qui velit ut sunt proident laboris qui elit aliqua adipisicing.\r\n",
    type: "green",
  },
  {
    _id: "5e98e0225b0fcf97e9d17829",
    title:
      "Irure in enim deserunt velit ut excepteur amet. Non eu nulla ullamco do officia fugiat est dolore aute eiusmod irure consequat. Laborum sint ea pariatur labore pariatur eiusmod non. Commodo amet eu nisi fugiat velit in non cillum eiusmod id fugiat velit qui tempor.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022a908cdef1ff4c223",
    title:
      "Ut ex velit eu et eiusmod labore laborum proident est incididunt enim dolore. Ullamco voluptate ad pariatur eiusmod exercitation. Eu laborum magna anim enim.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e0222f4007c2603f2e4c",
    title:
      "Ad tempor officia ullamco ullamco aliqua cupidatat incididunt. Adipisicing ex qui velit ad non laboris cupidatat ipsum qui culpa elit elit. Duis elit reprehenderit ad eu cupidatat commodo nostrud dolor. Incididunt labore aliqua do cillum nisi velit esse Lorem sit deserunt consequat. Adipisicing do minim nostrud reprehenderit voluptate eu veniam cillum qui laboris. Eu sit eu velit ex sint.\r\n",
    type: "green",
  },
  {
    _id: "5e98e022d875fa0d15966d87",
    title:
      "Voluptate exercitation qui nulla pariatur est cupidatat. Tempor amet aliquip eiusmod occaecat reprehenderit tempor voluptate mollit reprehenderit velit. Laborum in Lorem enim aliquip tempor. Aliquip id id laboris mollit magna Lorem eiusmod aliqua qui irure mollit in. Qui sunt esse aute elit.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e022b841e67bb25f45df",
    title:
      "Ad voluptate ullamco ad reprehenderit. Culpa esse eu amet ea proident incididunt. Labore tempor laboris ullamco consequat ipsum dolore proident. Aute ullamco et irure labore ea cillum elit elit elit aute velit ullamco. Ut dolor esse eiusmod eiusmod nostrud.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022a2ccf3c5ca9a00a7",
    title:
      "Esse nulla nulla non voluptate excepteur nisi velit laboris. Culpa est Lorem est dolor amet commodo laborum Lorem duis labore occaecat quis laborum dolor. Ipsum Lorem aute commodo reprehenderit commodo nostrud esse cillum fugiat officia laborum. Non sit elit commodo exercitation laborum minim fugiat laborum non qui id id cillum amet. Ipsum excepteur et ut in. Quis incididunt culpa laboris sunt enim cupidatat exercitation et aliquip ex sit occaecat cupidatat culpa. Dolor sit ex culpa elit id qui enim cillum proident labore anim cillum ex.\r\n",
    type: "green",
  },
  {
    _id: "5e98e022f1828609b2ea1a9b",
    title:
      "Minim minim adipisicing excepteur aliqua aliquip aliquip nostrud dolore duis voluptate sunt fugiat. Duis sunt pariatur nisi do tempor labore ipsum reprehenderit velit. Qui occaecat culpa reprehenderit voluptate nostrud cupidatat cillum laboris commodo irure. Non adipisicing fugiat nulla nostrud ut consectetur. Sint cupidatat Lorem aliqua in. Quis irure proident adipisicing excepteur consectetur. Laborum amet irure irure sunt consectetur Lorem nostrud elit fugiat.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e022a5bf9e19662d9395",
    title:
      "Aliqua nulla labore ea reprehenderit pariatur cupidatat incididunt ea sunt Lorem esse laborum. Aute cillum deserunt sit sit dolore elit adipisicing. Et ex est labore laboris eiusmod elit id ut in. Non ut eiusmod consectetur laborum officia magna cupidatat voluptate consequat magna aute irure occaecat quis.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e0228c5234f4ee7a9354",
    title:
      "Cupidatat tempor enim irure sit elit. Non esse ex amet ullamco aliqua proident incididunt labore voluptate. Sit sit esse nisi officia nostrud occaecat adipisicing enim dolore deserunt duis. Adipisicing laborum non aliqua sit. In est sunt adipisicing anim Lorem deserunt magna culpa laboris nisi non incididunt ullamco. Non in eu nulla ex consequat irure consectetur laborum voluptate adipisicing.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e0220245a993a16989d0",
    title:
      "Anim excepteur sint et non officia. Sint deserunt ea sunt est. Deserunt mollit eu sit non magna irure adipisicing commodo occaecat Lorem in. Qui aliqua ea nisi reprehenderit culpa.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e0225ba5efefda841434",
    title:
      "Incididunt aliquip aute magna veniam incididunt adipisicing nulla aute est Lorem veniam quis qui. Ipsum nostrud enim qui laborum ullamco enim elit voluptate qui id laborum et. Lorem esse exercitation reprehenderit excepteur ullamco consectetur nulla aliqua reprehenderit voluptate dolor. Laboris incididunt sint esse deserunt fugiat laborum sint ex dolore eu Lorem. Officia magna Lorem labore mollit pariatur veniam ut exercitation est adipisicing labore. Deserunt sit eiusmod non laboris elit officia. Est nisi do labore esse amet.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e02273459406340a20d8",
    title:
      "Sunt esse laboris ut nisi sit enim nulla culpa qui cupidatat aute. Ut anim cillum enim nulla esse labore proident eu et anim anim nisi. Lorem minim in tempor exercitation aliquip ullamco proident ullamco.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022715d6280167e5500",
    title:
      "Pariatur adipisicing minim cupidatat fugiat. Enim dolore eiusmod esse aliquip sint veniam qui tempor qui proident cupidatat officia. Non sint adipisicing in veniam eu proident amet qui duis adipisicing occaecat qui laboris. Occaecat fugiat excepteur tempor minim sint consectetur. Qui qui labore pariatur culpa pariatur. Sint est non ullamco eu adipisicing voluptate velit quis non fugiat esse nulla sint non. Cillum deserunt adipisicing veniam commodo fugiat in enim culpa.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022b63b3d75da81b874",
    title:
      "Irure sunt occaecat magna voluptate officia enim in ex velit enim. Minim sit sunt voluptate et in nulla duis in non amet velit pariatur Lorem. Nulla eiusmod laborum eiusmod pariatur consectetur laboris officia anim minim elit.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e0229ba371d9a8467cc7",
    title:
      "Nostrud eu proident sint tempor incididunt voluptate cupidatat ex ex duis reprehenderit reprehenderit ut id. Deserunt nisi consectetur sunt eu nulla qui nulla in sint cupidatat Lorem. Labore aliqua cupidatat exercitation Lorem id sunt dolore amet officia nisi.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e022b954612b27aa19df",
    title:
      "Enim tempor anim adipisicing ullamco ex mollit qui exercitation minim dolore in proident ullamco. Sit magna sit cillum ut laborum. Pariatur amet minim in Lorem aliqua do proident quis nisi anim aute.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e02244004143b0b9fb2c",
    title:
      "Occaecat commodo voluptate veniam esse officia consectetur non occaecat pariatur ad voluptate nostrud. Irure mollit velit cillum ad nostrud. Laborum exercitation consectetur reprehenderit excepteur culpa pariatur veniam. Amet magna quis deserunt ea ullamco. Eiusmod eiusmod eu proident et commodo amet eiusmod duis do quis non pariatur ad. In aliquip labore minim anim labore nisi voluptate proident. Nisi mollit voluptate cillum nulla.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e022e2235e4fb60bdb37",
    title:
      "Aliquip et id ad consequat occaecat eiusmod. Id ex in ad veniam qui ea labore excepteur. Lorem ullamco sunt do ipsum deserunt veniam ut reprehenderit exercitation enim aliquip mollit eiusmod. Aute minim Lorem ea esse irure do exercitation. Fugiat nulla ullamco nostrud exercitation nulla est. Voluptate cillum ut labore dolor non est ullamco consectetur eu anim irure adipisicing. Voluptate esse sunt enim tempor do nostrud esse incididunt mollit ut nisi aliqua consequat.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022d9683a27586b65ed",
    title:
      "Fugiat veniam duis voluptate ut dolore. Quis cillum eu aute tempor nisi veniam amet aute. Aliqua fugiat Lorem dolore dolor. Consectetur tempor veniam sint laborum cupidatat. Anim laboris culpa incididunt elit excepteur commodo laborum est. Exercitation dolore pariatur sit ipsum deserunt incididunt.\r\n",
    type: "brown",
  },
  {
    _id: "5e98e022aafdf3c4461116a7",
    title:
      "Pariatur laborum mollit in nulla do id esse ea in adipisicing eu exercitation. Laboris ut ex proident exercitation incididunt reprehenderit anim Lorem ad officia id est enim et. Culpa quis fugiat veniam Lorem culpa elit proident in occaecat ullamco amet proident fugiat proident. Officia mollit cupidatat ex aliquip eiusmod duis incididunt ipsum nulla. Sunt excepteur magna consequat aute eiusmod reprehenderit et ut labore. Velit qui do eiusmod Lorem ut veniam ea aliquip labore.\r\n",
    type: "blue",
  },
  {
    _id: "5e98e02215eff3d2d1c2e08d",
    title:
      "Sunt fugiat et occaecat voluptate exercitation laboris aliqua. Anim ea in sit ea id tempor proident aliquip labore excepteur est enim dolore. Cupidatat ad excepteur ea enim incididunt labore duis ipsum incididunt commodo. Cillum officia reprehenderit officia cupidatat sunt. Proident veniam amet id reprehenderit ex dolore esse nisi adipisicing. Do nostrud quis ex tempor id amet deserunt officia cillum commodo deserunt adipisicing laborum nisi. Exercitation anim minim cupidatat qui velit aute mollit occaecat duis aliquip eu nulla enim.\r\n",
    type: "green",
  },
];

function filterItem(query, data, _index, exactMatch) {
  const normalizedTitle = data.title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${normalizedTitle} ${data.type}`.indexOf(normalizedQuery) >= 0;
  }
}

function highlightText(text, query) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export function areItemsEqual(itemA, itemB) {
  // Compare only the titles (ignoring case) just for simplicity.
  return itemA.title.toLowerCase() === itemB.title.toLowerCase();
}

export function doesItemEqualQuery(item, query) {
  return item.title.toLowerCase() === query.toLowerCase();
}

export function arrayContainsItem(items, itemToFind) {
  return items.some((item) => item.title === itemToFind.title);
}

export function addItemToArray(items, itemToAdd) {
  return [...items, itemToAdd];
}

function createSearchItem(data, { handleClick, modifiers, query }) {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={data.title}
      key={data._id}
      // onClick={handleClick}
      text={highlightText(data.title, query)}
    />
  );
}

export default function SelectWrapper() {
  return (
    <Suggest
      itemsEqual={areItemsEqual}
      items={mockData}
      noResults={<MenuItem disabled={true} text="No results." />}
      popoverProps={{ minimal: true }}
      itemPredicate={filterItem}
      itemRenderer={createSearchItem}
      minimal
      resetOnClose
      resetOnQuery
      resetOnSelect
      filterable
    >
      <Button
        icon="film"
        rightIcon="caret-down"
        text={
          mockData[0]
            ? `${mockData[0].title} (${mockData[0].type})`
            : "(No selection)"
        }
      />
    </Suggest>
  );
}
