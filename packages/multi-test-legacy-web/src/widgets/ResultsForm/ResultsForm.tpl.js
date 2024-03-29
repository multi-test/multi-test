import map from 'lodash/map';
import chunk from 'lodash/chunk';
import i18n from 'util/i18n';
import format from 'util/date';
import { quoteattr, escape } from 'util/xss';

function renderAnswer(value, index) {
    const { offset, metaData } = this;
    const answer = value !== undefined ? metaData.getAnswer(value) : '';

    return `
      <tr>
        <td>${1 + index + offset}</td>
        <td>${answer}</td>
      </tr>
    `;
}

function renderAnswers(answers, extra) {
    return `
        <table class="bordered" style="float: left">
          <thead><tr>
            <th>${i18n('QUESTION_INDEX')}</th>
            <th>${i18n('ANSWER')}</th>
          </tr></thead>
          <tbody>
            ${map(answers, renderAnswer.bind(extra)).join('')}
          </tbody>
        </table>
    `;
}

function renderScale({ id, text, result }) {
    const value = result.value !== undefined ? result.value : result;
    const td3 = this.hasT ? `<td>${result.t}</td>` : '';

    return `
      <tr>
        <td title="${quoteattr(text)}">${escape(id)}</td>
        <td>${value}</td>
        ${td3}
      </tr>
    `;
}

function renderScales(scales) {
    const hasT = scales[0] && scales[0].result.hasOwnProperty('t');

    return `
        <table class="bordered">
          <thead>
          <tr>
            <th>${i18n('SCALE')}</th>
            <th>${i18n('SCORE')}</th>
            ${hasT ? `<th>${i18n('T_SCORE')}</th>` : ''}
          </tr>
          </thead>
          <tbody>
            ${map(scales, renderScale.bind({ hasT })).join('')}
          </tbody>
        </table>
    `;
}

export default ({
    id, user, answers, metaData, scales,
}) => `
    <div id="${id}" class="ResultsForm screen">
      <table class="wide">
        <tr>
            <th class="w8">
                ${i18n('FULL_NAME')}
            </th>
            <td class="under-border">
                ${escape(user.name)}
            </td>
        </tr>
        <tr>
            <th class="w8">
                ${i18n('AGE')}
            </th>
            <td class="under-border">
                ${escape(user.age)}
            </td>
        </tr>
        <tr>
            <th class="w8">
                ${i18n('DATE')}
            </th>
            <td class="under-border">
                ${format(new Date())}
            </td>
        </tr>
      </table>
      <table class="wide">
        <tr>
          <td class="topped clearfix">
            ${chunk(answers, Math.min(38, Math.ceil(answers.length / 2)))
        .reduce(({ offset, html }, value) => ({
            offset: offset + value.length,
            html: html + renderAnswers(value, { offset, metaData }),
        }), { offset: 0, html: '' }).html}
          </td>
          <td></td>
          <td class="topped">
              ${renderScales(scales)}
          </td>
        </tr>
      </table>
    </div>
`;
