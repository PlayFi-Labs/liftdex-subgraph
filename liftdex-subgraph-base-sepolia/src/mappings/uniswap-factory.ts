/* eslint-disable prefer-const */
import {PairCreated} from "../types/Factory/Factory";
import {Bundle, UniswapPair} from "../types/schema";
import {Address, BigDecimal, log} from '@graphprotocol/graph-ts'
import {address2string} from "./helpers";
import { UniswapPair as PairTemplate } from '../types/templates'


const USDC_WETH_PAIR = '0x0B9Ab53880be6fF805ebF8FBce515E5715ccE1bE' // created 10008355

export function handleNewPair(event: PairCreated): void {

  // Only handles the creation of the USDC/WETH pair!!!
  if(address2string(event.params.pair) == address2string(Address.fromString(USDC_WETH_PAIR))) {

    // create new bundle
    let bundle = new Bundle('1')
    bundle.ethPrice = BigDecimal.zero();
    bundle.save();

    let pair = new UniswapPair(address2string(event.params.pair)) as UniswapPair
    pair.token0Price = BigDecimal.zero();
    pair.token1Price = BigDecimal.zero();
    pair.reserve0 = BigDecimal.zero();
    pair.reserve1 = BigDecimal.zero();

    // create the tracked contract based on the template
    PairTemplate.create(event.params.pair)

    pair.save()
  }
}