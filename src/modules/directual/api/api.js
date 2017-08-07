import promisePoller from 'promise-poller';
import config from '../config';
import { checkStatus, parseJSON } from '../net';


// Example
// directual.api.structure('agreement_status).list({ ... }).then();

/**
 *
 * @enum {string}
 */
const VerbType = {
  GET: 'GET',
  POST: 'POST',
};


/**
 *
 * @enum {string}
 */
const EndpointMethod = {
  CREATE: '',
  LIST: 'list',
  SEARCH: 'search',
  META: 'metainfo',
};


const EndpointMethodVerbTypeMap = {
  [EndpointMethod.CREATE]: VerbType.POST,
  [EndpointMethod.META]: VerbType.GET,
  [EndpointMethod.LIST]: VerbType.GET,
  [EndpointMethod.SEARCH]: VerbType.POST,
};


/**
 *
 * @enum {string}
 */
const EndpointType = {
  STRUCTURE: 'structure',
};


const EndpointTypeToLocationPartMap = {
  [EndpointType.STRUCTURE]: 'struct',
};


class Endpoint {
  constructor() {
    this.type = null;
    this.name = null;
  }


  /**
   *
   * @param {EndpointMethod} endpointMethod
   * @param {Object} body
   * @return {Promise}
   */
  fetch(endpointMethod, body) {
    const endpointLocationPart = EndpointTypeToLocationPartMap[this.type];
    const location = `${config.BASE_URI}${config.DATA_URI}/${endpointLocationPart}/${this.name}/${endpointMethod}`;
    let query = `?appID=${config.APP_ID}&appSecret=${config.APP_SECRET}`;
    if (endpointMethod === 'metainfo') {
      query += '&ok=true';
    }
    const url = `${location}${query}`;
    // `https://directual.com/good/api/v3/struct/agreement_status/list?appID=${config.APP_ID}&appSecret=${config.APP_SECRET}`

    // {
    //   filters: [
    //     {
    //       field: 'link_employee',
    //       value: this.state.userId,
    //       exp: '==',
    //     },
    //   ],
    //       fetch: '',
    //     fields: '',
    //     pageSize: 10,
    //     page: 0,
    //     allObjects: true,
    //     orders: [],
    // }

    const options = {
      method: EndpointMethodVerbTypeMap[endpointMethod],
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return window
        .fetch(url, options)
        .then(response =>
          // eslint-disable-next-line no-console
           response)
        .then(checkStatus)
        .then(parseJSON);
  }

  getMetaInfo(body) {
    return this.fetch(EndpointMethod.META, body);
  }

  /**
   *
   * @param {Object} body
   * @return {Promise}
   */
  create(body) {
    return this.fetch(EndpointMethod.CREATE, body);
  }

  /**
   *
   * @param {Object} body
   * @return {Promise}
   */
  createAndValidate(body) {
    // 1 добавляем объект в базу данных
    return this.create(body).then((payload) => {
      // 2 объект добавлен. у нас есть id объекта
      const id = payload.result.lastObjectID;
      // 3 формируем запрос на сервер для promise poller
      const validateTask = () =>
        // ищем только что добавленный объект по ID из шага 2
        this.searchByIdFromIndex(id).then((response) => {
          const booking = response.result.list[0].obj;
          const { resp_msg: respMsg, resp_code } = booking;
          // Нам необходимо дождаться пока поле resp_msg будет заполнено.
          // Это говорит о том, что все сценарии валидации отработали
          if (respMsg) return { code: resp_code, message: respMsg, booking };
          // Если поле пустое - тогда выкидываем Error.
          // Это необходимо для следующего запроса по документации promisePoller
          throw new Error('waiting for validate scenario complete');
        });

      // https://github.com/joeattardi/promise-poller
      // eslint-disable-next-line no-unused-vars
      function progress(retriesRemaining, error) {
        // eslint-disable-next-line no-console
        console.log(retriesRemaining, 'request validate');
        console.log(error);
      }
      return promisePoller({
        taskFn: validateTask,
        progressCallback: progress,
        // interval: 300,
        retries: 5,
      });
    });
  }


  /**
   *
   * @param {Object=} body
   * @return {Promise}
   */
  list(body) {
    return this.fetch(EndpointMethod.LIST, body);
  }


  /**
   *
   * @param {Object} body
   * @return {Promise}
   */
  search(body) {
    return this.fetch(EndpointMethod.SEARCH, body);
  }
}


/**
 * @extends {Endpoint}
 */
class Structure extends Endpoint {
  constructor(name) {
    super();

    /**
     * @type {EndpointType}
     */
    this.type = EndpointType.STRUCTURE;

    /**
     * @type {string}
     */
    this.name = name;
  }
}

/**
 *
 */
class ApiClient {
  /**
   * todo: remove eslint-disable-next-line
   * @param {string} name
   * @return {Structure}
   */
  // eslint-disable-next-line class-methods-use-this
  structure(name) {
    return new Structure(name);
  }
}


export default new ApiClient();
