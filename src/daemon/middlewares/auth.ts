import {
  HttpErr,
  RouteMiddlewareConfig,
} from "../../lib/HttpServer";

import type {
  User,
} from "../../headers/user_interface.h";
import { hmac_sha256 } from "../../lib/crypto";
import { UserService } from "../services/user";

declare module "../../lib/HttpServer" {
  interface HttpReqPartial {
    p_user: User;
  }
}

const middleware_auth = (userservice: UserService): RouteMiddlewareConfig => async ({}) => {
  return async (req) => {
    const authorize_h = req.headers['authorization'];
      if (!authorize_h) { throw new HttpErr({
        status_code: 401,
        message: 'unauthorized',
      });
    }
    if (!authorize_h.startsWith('Basic ')) { throw new HttpErr({
        status_code: 401,
        message: 'unauthorized',
      });
    }
    const [username, payload] = Buffer.from(
      authorize_h.replace('Basic ', ''),
      'base64',
    ).toString().split(':');
    const model = await userservice.model.find_by_id(username)
      .catch(() => { throw new HttpErr({
        status_code: 401,
        message: 'unauthorized'
      })
    });
    const payload_expected = hmac_sha256(JSON.stringify({ id: model.id }), model.passwd);
    if (payload !== payload_expected) { throw new HttpErr({
        status_code: 401,
        message: 'unauthorized',
      });
    }
    req.p_user = model;
    // Old way with a rsa signature
    // const public_key = await user_service.get_pub_key_by_id(model.id);
    // const verify = crypto.createVerify('SHA256');
    // verify.update(JSON.stringify(model));
    // verify.end();
    // const is_verified = verify.verify(public_key, Buffer.from(payload, 'base64'));
    // console.log({
    //   is_verified,
    // })
  }
}

export default middleware_auth;
