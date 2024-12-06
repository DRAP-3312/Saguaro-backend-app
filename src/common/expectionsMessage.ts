import { BadRequestException, NotFoundException } from '@nestjs/common';

type errorType = 'notFount' | 'badRequest';
export const exceptionMessage = (
  entity: string,
  param: any,
  type: errorType,
  atribute: string,
) => {
  switch (type) {
    case 'badRequest':
      throw new BadRequestException();
    case 'notFount':
      throw new NotFoundException(
        `${entity} with ${atribute} '${param}' not found`,
      );
  }
};
