import { RmqRecordBuilder } from '@nestjs/microservices';

export function buildRmqRecord(req: any, payload: any) {
  return new RmqRecordBuilder(payload)
    .setOptions({
      headers: {
        authorization: req.headers['authorization'] as string,
      },
    })
    .build();
}
