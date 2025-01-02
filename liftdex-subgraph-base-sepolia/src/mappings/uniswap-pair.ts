/* eslint-disable prefer-const */
import { BigInt } from '@graphprotocol/graph-ts/index'

import {Sync} from "../types/templates/Pair/Pair";
import {Bundle, UniswapPair} from "../types/schema";
import {getEthPriceInUSD} from "./pricing";
import {address2string, convertTokenToDecimal} from "./helpers";
import {Address, BigDecimal, log} from "@graphprotocol/graph-ts";

const USDC_WETH_PAIR = '0x0B9Ab53880be6fF805ebF8FBce515E5715ccE1bE' // created 10008355

export function handleSync(event: Sync): void {

  // Only handles the sync of the USDC/WETH pair!!!
  if(address2string(event.address) == address2string(Address.fromString(USDC_WETH_PAIR))) {
    let pair = UniswapPair.load(address2string(event.address))!
    pair.reserve0 = convertTokenToDecimal(event.params.reserve0, BigInt.fromString("6"))
    pair.reserve1 = convertTokenToDecimal(event.params.reserve1, BigInt.fromString("18"))

    if (pair.reserve1.notEqual(BigDecimal.zero())) pair.token0Price = pair.reserve0.div(pair.reserve1)
    else pair.token0Price = BigDecimal.zero()
    if (pair.reserve0.notEqual(BigDecimal.zero())) pair.token1Price = pair.reserve1.div(pair.reserve0)
    else pair.token1Price = BigDecimal.zero()

    pair.save()

    // update ETH price now that reserves could have changed
    let bundle = Bundle.load('1')!
    bundle.ethPrice = getEthPriceInUSD()
    bundle.save()
  }
}